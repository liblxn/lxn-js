import {test} from "testsome";
import {Digits, digits, formatNum} from "./number";
import {numberFormat} from "./util_test";



test("digits", t => {
	const tests = {
		"integer": [
			{
				num: 7,
				nf: numberFormat({maxFractionDigits: 2}),
				expected: {int: [7], frac: []},
			},
			{
				num: 7,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 4}),
				expected: {int: [7], frac: [0, 0]},
			},
			{
				num: 7,
				nf: numberFormat({minIntegerDigits: 3, minFractionDigits: 2, maxFractionDigits: 4}),
				expected: {int: [0, 0, 7], frac: [0, 0]},
			},
		],

		"rational": [
			{
				num: 3.141592,
				nf: numberFormat(),
				expected: {int: [3], frac: []},
			},
			{
				num: 3.141592,
				nf: numberFormat({maxFractionDigits: 2}),
				expected: {int: [3], frac: [1, 4]},
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 4}),
				expected: {int: [3], frac: [1, 4, 1, 6]},
			},
			{
				num: 3.141592,
				nf: numberFormat({minIntegerDigits: 3, minFractionDigits: 2, maxFractionDigits: 4}),
				expected: {int: [0, 0, 3], frac: [1, 4, 1, 6]},
			},
		],
	};


	for(const name in tests) {
		t.run(name, t => {
			tests[name].forEach(test => {
				const pos = digits(test.num, 0, test.nf);
				if(!equalDigits(pos, test.expected)) {
					t.error(`unexpected positive digits: {int[${pos.int}], frac[${pos.frac}]}`);
				}

				const neg = digits(-test.num, 0, test.nf);
				if(!equalDigits(neg, test.expected)) {
					t.error(`unexpected negative digits: {int[${neg.int}], frac[${neg.frac}]}`);
				}
			});
		});
	}
});


test("formatNum", t => {
	const tests = {
		"nan": [
			{
				num: NaN,
				nf: numberFormat({
					symbols:{nan: "$$nan$$"},
				}),
				expected: "$$nan$$",
			},
		],

		"infinity": [
			{
				num: Number.POSITIVE_INFINITY,
				nf: numberFormat({
					symbols:{inf: "$$inf$$"},
					negativePrefix: "--",
				}),
				expected: "$$inf$$",
			},
			{
				num: Number.NEGATIVE_INFINITY,
				nf: numberFormat({symbols:{inf: "$$inf$$"}, negativePrefix: "--"}),
				expected: "--$$inf$$",
			},
		],

		"integer": [
			{
				num: 7,
				nf: numberFormat({
					symbols: {zero: 0x30},
					positivePrefix: "p",
					positiveSuffix: "s",
				}),
				expected: "p7s",
			},
			{
				num: -7,
				nf: numberFormat({
					symbols: {zero: 0x30, minus: "minus"},
					negativePrefix: "-",
					negativeSuffix: "\u00a4",
				}),
				currency: "$$",
				expected: "minus7$$",
			},
			{
				num: 7000,
				nf: numberFormat({
					symbols: {zero: 0x30, group: "_"},
					positivePrefix: "p",
					positiveSuffix: "s",
					primaryIntegerGrouping: 2,
					secondaryIntegerGrouping: 2,
				}),
				expected: "p70_00s",
			},
			{
				num: 70000,
				nf: numberFormat({
					symbols: {zero: 0x30, group: "_"},
					positivePrefix: "p",
					positiveSuffix: "s",
					primaryIntegerGrouping: 2,
					secondaryIntegerGrouping: 2,
				}),
				expected: "p7_00_00s",
			},
			{
				num: 700000,
				nf: numberFormat({
					symbols: {zero: 0x30, group: "_"},
					positivePrefix: "p",
					positiveSuffix: "s",
					primaryIntegerGrouping: 3,
					secondaryIntegerGrouping: 2,
				}),
				expected: "p7_00_000s",
			},
			{
				num: 7000000,
				nf: numberFormat({
					symbols: {zero: 0x30, group: "_"},
					positivePrefix: "p",
					positiveSuffix: "s",
					primaryIntegerGrouping: 3,
					secondaryIntegerGrouping: 2,
				}),
				expected: "p70_00_000s",
			},
		],

		"rational": [
			{
				num: 3.141592,
				nf: numberFormat({
					symbols: {zero: 0x30, decimal: ":"},
					minFractionDigits: 4,
					maxFractionDigits: 6,
					positivePrefix: "p",
					positiveSuffix: "s",
				}),
				expected: "p3:141592s",
			},
			{
				num: -3.14,
				nf: numberFormat({
					symbols: {zero: 0x30, decimal: ":", minus: "minus"},
					minFractionDigits: 2,
					maxFractionDigits: 2,
					negativePrefix: "-",
					negativeSuffix: "\u00a4",
				}),
				currency: "$$",
				expected: "minus3:14$$",
			},
			{
				num: 3.141592,
				nf: numberFormat({
					symbols: {zero: 0x30, decimal: ":", group: "_"},
					minFractionDigits: 0,
					maxFractionDigits: 6,
					positivePrefix: "p",
					positiveSuffix: "s",
					fractionGrouping: 2,
				}),
				expected: "p3:14_15_92s",
			},
			{
				num: 3.141592,
				nf: numberFormat({
					symbols: {zero: 0x30, decimal: ":", group: "_"},
					minFractionDigits: 5,
					maxFractionDigits: 5,
					positivePrefix: "p",
					positiveSuffix: "s",
					fractionGrouping: 3,
				}),
				expected: "p3:141_59s",
			},
			{
				num: 314.1592,
				nf: numberFormat({
					symbols: {zero: 0x30, decimal: ":", group: "_"},
					minFractionDigits: 4,
					maxFractionDigits: 4,
					positivePrefix: "p",
					positiveSuffix: "s",
					primaryIntegerGrouping: 2,
					secondaryIntegerGrouping: 2,
					fractionGrouping: 3,
				}),
				expected: "p3_14:159_2s",
			},
		],
	};

	for(const name in tests) {
		t.run(name, t => {
			tests[name].forEach(test => {
				const s = formatNum(test.num, test.nf, test.currency);
				if(s !== test.expected) {
					t.error(`unexpected formatted number: ${s}`);
				}
			});
		});
	}
});


function equalDigits(left: Digits, right: Digits): boolean {
	if(left.int.length !== right.int.length || left.frac.length !== right.frac.length) {
		return false;
	}

	for(let i = 0; i < left.int.length; ++i) {
		if(left.int[i] !== right.int[i]) {
			return false;
		}
	}
	for(let i = 0; i < left.frac.length; ++i) {
		if(left.frac[i] !== right.frac[i]) {
			return false;
		}
	}
	return true;
}
