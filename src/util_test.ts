import {Locale, NumberFormat} from "./internal/catalog";



export function numberFormat(nf?: any): NumberFormat {
	nf = nf || {};
	return {
		symbols: {
				decimal: nf.symbols && nf.symbols.decimal != null ? nf.symbols.decimal : ".",
				group: nf.symbols && nf.symbols.group != null ? nf.symbols.group : ",",
				percent: nf.symbols && nf.symbols.percent != null ? nf.symbols.percent : "%",
				minus: nf.symbols && nf.symbols.minus != null ? nf.symbols.minus : "-",
				inf: nf.symbols && nf.symbols.inf != null ? nf.symbols.inf : "inf",
				nan: nf.symbols && nf.symbols.nan != null ? nf.symbols.nan : "NaN",
				zero: nf.symbols && nf.symbols.zero != null ? nf.symbols.zero : 0x30,
		},
		positivePrefix: nf.positivePrefix || "",
		positiveSuffix: nf.positiveSuffix || "",
		negativePrefix: nf.negativePrefix || "-",
		negativeSuffix: nf.negativeSuffix || "",
		minIntegerDigits: nf.minIntegerDigits || 0,
		minFractionDigits: nf.minFractionDigits || 0,
		maxFractionDigits: nf.maxFractionDigits || 0,
		primaryIntegerGrouping: nf.primaryIntegerGrouping || 0,
		secondaryIntegerGrouping: nf.secondaryIntegerGrouping || 0,
		fractionGrouping: nf.fractionGrouping || 0,
	};
}


export function locale(loc?: any): Locale {
	loc = loc || {};
	return {
		id: loc.id || "",
		decimalFormat: numberFormat(loc.decimalFormat),
		moneyFormat: numberFormat(loc.moneyFormat),
		percentFormat: numberFormat(loc.percentFormat),
		cardinalPlurals: loc.cardinalPlurals || [],
		ordinalPlurals: loc.ordinalPlurals || [],
	};
}
