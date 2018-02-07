import {NumberFormat, Symbols} from "lxn-schema";



export interface Digits {
	int: number[];
	frac: number[];
}



export function digits(v: number, zero: number, nf: NumberFormat): Digits {
	const n = Math.abs(v).toFixed(nf.maxFractionDigits).split("."); // [integer part, fractional part?]
	if(n[0].length < nf.minIntegerDigits) {
		n[0] = "0".repeat(nf.minIntegerDigits - n[0].length) + n[0];
	}
	n[1] = n[1] || "";
	while(n[1].length > nf.minFractionDigits && n[1].endsWith("0")) {
		n[1] = n[1].slice(0, -1);
	}

	function toArray(s: string): number[] {
		return Array.from(s).map(c => zero + c.charCodeAt(0) - 48)
	}

	return {
		int: toArray(n[0]),
		frac: toArray(n[1]),
	};
}


export function formatNum(v: number, nf: NumberFormat, curr?: string): string {
	if(isNaN(v)) {
		return nf.symbols.nan;
	}
	if(!isFinite(v)) {
		return affix(v < 0 ? nf.negativePrefix : nf.positivePrefix, nf.symbols, curr)
			+ nf.symbols.inf
			+ affix(v < 0 ? nf.negativeSuffix : nf.positiveSuffix, nf.symbols, curr);
	}

	const d = digits(v, nf.symbols.zero, nf);
	return affix(v < 0 ? nf.negativePrefix : nf.positivePrefix, nf.symbols, curr)
		+ fmtInt(d.int, nf.primaryIntegerGrouping, nf.secondaryIntegerGrouping, nf.symbols)
		+ fmtFrac(d.frac, nf.fractionGrouping, nf.symbols)
		+ affix(v < 0 ? nf.negativeSuffix : nf.positiveSuffix, nf.symbols, curr);
}


function fmtInt(digits: number[], primGroup: number, secGroup: number, symb: Symbols): string {
	let s = "";
	if(primGroup > 0) {
		// secondary groups
		const lead = (digits.length - primGroup) % secGroup;
		if(lead > 0) {
			s += String.fromCodePoint(...digits.slice(0, lead)) + symb.group;
			digits = digits.slice(lead);
		}
		while(digits.length > primGroup) {
			s += String.fromCodePoint(...digits.slice(0, secGroup)) + symb.group;
			digits = digits.slice(secGroup);
		}
	}

	// primary group
	return s + String.fromCodePoint(...digits);
}

function fmtFrac(digits: number[], group: number, symb: Symbols): string {
	if(!digits.length) {
		return "";
	}

	let s = symb.decimal;
	if(group > 0) {
		while(digits.length > group) {
			s += String.fromCodePoint(...digits.slice(0, group)) + symb.group;
			digits = digits.slice(group);
		}
	}
	return s + String.fromCodePoint(...digits);
}

function affix(s: string, symb: Symbols, curr?: string): string {
	// We need to use a function here for the second parameter
	// in String.replace since for a string several custom
	// replacements take place (e.g. $$ -> $).
	if(curr) {
		s = s.replace("\u00a4", () => curr); // ¤
	}
	return s.replace("-", () => symb.minus).replace("%", () => symb.percent);
}
