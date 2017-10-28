import {decode} from "messagepack";
import {formatNum} from "./number";
import {pluralTag} from "./plural";
import {
	Catalog,
	Locale,
	Message,
	NumberFormat,
	PluralTag,
	PluralType,
	Replacement,
	ReplacementType,
	PluralDetails,
	MoneyDetails,
	SelectDetails,
} from "./internal/catalog";



export interface Context {
	[key: string]: any;
}

export type Translator = (key: string, ctx: Context) => string;



export function readCatalog(buf: BufferSource): Translator {
	const cat = decode(buf, Catalog);
	let msgs = {};
	cat.messages.forEach(m => {
		msgs[m.section ? m.section+"."+m.key : m.key] = m;
	});

	return function(key: string, ctx: Context): string {
		return formatMsg(msgs[key], ctx, cat.locale);
	}
}


function formatMsg(msg: Message, ctx: Context, loc: Locale): string {
	if(!msg) {
		return "";
	}

	let res = "";
	let off = 0;
	msg.text.forEach((t, i) => {
		while(off < msg.replacements.length && msg.replacements[off].textPos <= i) {
			res += replace(msg.replacements[off], ctx, loc);
			++off;
		}
		res += t;
	});
	msg.replacements.slice(off).forEach(r => {
		res += replace(r, ctx, loc);
	});
	return res;
}


function replace(r: Replacement, ctx: Context, loc: Locale): string {
	const v = ctx[r.key];
	if(v == null) {
		return missingVar(r.key);
	}

	switch(r.type) {
	case ReplacementType.StringReplacement:
		return typeof v !== "string" ? invalidVar(r.key) : v;

	case ReplacementType.NumberReplacement:
		return replNum(v, r.key, loc.decimalFormat);

	case ReplacementType.PercentReplacement:
		return replNum(v, r.key, loc.percentFormat);

	case ReplacementType.MoneyReplacement:
		const curr = ctx[(r.details as MoneyDetails).currency];
		return curr == null ? missingVar((r.details as MoneyDetails).currency)
			: typeof curr !== "string" ? invalidVar((r.details as MoneyDetails).currency)
			: replNum(v, r.key, loc.moneyFormat, curr)

	case ReplacementType.PluralReplacement:
		return replPlural(v, r.key, ctx, r.details as PluralDetails, loc);

	case ReplacementType.SelectReplacement:
		return formatMsg((r.details as SelectDetails).cases[v.toString()] ||(r.details as SelectDetails).cases[(r.details as SelectDetails).fallback], ctx, loc)

	default:
		return unsupportedReplType(r.type);
	}
}


function replNum(v: any, key: string, nf: NumberFormat, curr?: string): string {
	return typeof v !== "number" ? invalidVar(key) : formatNum(v, nf, curr);
}

function replPlural(v: any, key: string, ctx: Context, details: PluralDetails, loc: Locale): string {
	let tag = PluralTag.Other;
	if(typeof v === "number") {
		if(v in details.custom) {
			return formatMsg(details.custom[v], ctx, loc);
		}
		tag = pluralTag(v, loc.decimalFormat, details.type === PluralType.Ordinal ? loc.ordinalPlurals : loc.cardinalPlurals);
	}
	return formatMsg(details.variants[tag] || details.variants[PluralTag.Other], ctx, loc);
}


function missingVar(key: string): string {
	return `%!(MISSING:${key})`;
}

function invalidVar(key: string): string {
	return `%!(INVALID:${key})`;
}

function unsupportedReplType(t: ReplacementType): string {
	return `%!(UNSUPPORTED:ReplType-${t})`
}
