import {test} from "testsome";
import {pluralTag} from "./plural";
import {PluralTag, Operand, Connective} from "./internal/catalog";
import {numberFormat} from "./util_test";



test("pluralTag", t => {
	const tests = {
		"absolute values": [
			{
				num: 7,
				nf: numberFormat({maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Few,
						rules: [
							{
								operand: Operand.AbsoluteValue,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 7, upperBound: 7}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Few,
			},
			{
				num: 7,
				nf: numberFormat({maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Few,
						rules: [
							{
								operand: Operand.AbsoluteValue,
								modulo: 5,
								negate: false,
								ranges: [{lowerBound: 2, upperBound: 2}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Few,
			},
			{
				num: 7.5,
				nf: numberFormat({maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Few,
						rules: [
							{
								operand: Operand.AbsoluteValue,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 6, upperBound: 8}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Few,
			},
		],

		"integer digits": [
			{
				num: 7.5,
				nf: numberFormat({maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Many,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 7, upperBound: 7}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Many,
			},
			{
				num: 0.5,
				nf: numberFormat({maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Many,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 10,
								negate: false,
								ranges: [{lowerBound: 0, upperBound: 0}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Many,
			},
			{
				num: 75.25,
				nf: numberFormat({maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Many,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 10,
								negate: false,
								ranges: [{lowerBound: 5, upperBound: 5}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Many,
			},
		],

		"number of fraction digits with trailing zeros": [
			{
				num: 7,
				nf: numberFormat({maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Two,
						rules: [
							{
								operand: Operand.NumFracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 0, upperBound: 0}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Two,
			},
			{
				num: 7,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 4}),
				rules: [
					{
						tag: PluralTag.Two,
						rules: [
							{
								operand: Operand.NumFracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 2, upperBound: 2}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Two,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 6, maxFractionDigits: 6}),
				rules: [
					{
						tag: PluralTag.Two,
						rules: [
							{
								operand: Operand.NumFracDigits,
								modulo: 4,
								negate: false,
								ranges: [{lowerBound: 2, upperBound: 2}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Two,
			},
		],

		"number of fraction digits without trailing zeros": [
			{
				num: 7,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.One,
						rules: [
							{
								operand: Operand.NumFracDigitsNoZeros,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 0, upperBound: 0}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.One,
			},
			{
				num: 7.5,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.One,
						rules: [
							{
								operand: Operand.NumFracDigitsNoZeros,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 1, upperBound: 1}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.One,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 6, maxFractionDigits: 6}),
				rules: [
					{
						tag: PluralTag.One,
						rules: [
							{
								operand: Operand.NumFracDigitsNoZeros,
								modulo: 4,
								negate: false,
								ranges: [{lowerBound: 2, upperBound: 2}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.One,
			},
		],

		"fraction digits value with trailing zeros": [
			{
				num: 7,
				nf: numberFormat({maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Zero,
						rules: [
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 0, upperBound: 0}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Zero,
			},
			{
				num: 7.5,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Zero,
						rules: [
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 50, upperBound: 50}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Zero,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 6, maxFractionDigits: 6}),
				rules: [
					{
						tag: PluralTag.Zero,
						rules: [
							{
								operand: Operand.FracDigits,
								modulo: 100,
								negate: false,
								ranges: [{lowerBound: 92, upperBound: 92}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Zero,
			},
		],

		"fraction digits value without trailing zeros": [
			{
				num: 7,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Zero,
						rules: [
							{
								operand: Operand.FracDigitsNoZeros,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 0, upperBound: 0}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Zero,
			},
			{
				num: 7.5,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Zero,
						rules: [
							{
								operand: Operand.FracDigitsNoZeros,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 5, upperBound: 5}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Zero,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 8, maxFractionDigits: 8}),
				rules: [
					{
						tag: PluralTag.Zero,
						rules: [
							{
								operand: Operand.FracDigitsNoZeros,
								modulo: 100,
								negate: false,
								ranges: [{lowerBound: 92, upperBound: 92}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Zero,
			},
		],

		"conjunction": [
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Few,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Few,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Few,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Other,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Few,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Other,
			},
		],

		"disjunction": [
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Few,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Disjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Few,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Few,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Disjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Few,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Few,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Disjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Other,
			},
		],

		"conjunction and disjunction": [
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Many,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.Disjunction,
							},
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Many,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Many,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.Disjunction,
							},
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Many,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Many,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.Disjunction,
							},
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Many,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Many,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.Disjunction,
							},
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Many,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Many,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.Disjunction,
							},
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Many,
			},
			{
				num: 3.141592,
				nf: numberFormat({minFractionDigits: 2, maxFractionDigits: 2}),
				rules: [
					{
						tag: PluralTag.Many,
						rules: [
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.Disjunction,
							},
							{
								operand: Operand.IntegerDigits,
								modulo: 0,
								negate: true,
								ranges: [{lowerBound: 3, upperBound: 3}],
								connective: Connective.Conjunction,
							},
							{
								operand: Operand.FracDigits,
								modulo: 0,
								negate: false,
								ranges: [{lowerBound: 14, upperBound: 14}],
								connective: Connective.None,
							},
						],
					},
				],
				expected: PluralTag.Other,
			},
		],
	};

	for(const name in tests) {
		t.run(name, t => {
			tests[name].forEach(test => {
				const tag = pluralTag(test.num, test.nf, test.rules);
				if(tag !== test.expected) {
					t.error(`unexpected plural tag: ${tag}`);
				}
			});
		});
	}
});
