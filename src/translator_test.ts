import {test} from "testsome";
import {encode} from "messagepack";
import {Translator} from "./translator";
import {readCatalog} from "./translator";
import {locale} from "./util_test";
import {
	Catalog,
	Locale,
	Message,
	ReplacementType,
	PluralTag,
	PluralType,
	Operand,
} from "./internal/catalog";



test("readCatalog", t => {
	t.run("complete input", t => {
		const tests = [
			// no replacement
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foobar"],
					replacements: [],
				},
				loc: locale(),
				ctx: {},
				expected: "foobar",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo", "bar"],
					replacements: [],
				},
				loc: locale(),
				ctx: {},
				expected: "foobar",
			},

			// string replacement
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.StringReplacement,
							details: {},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey": "replval",
				},
				expected: "foo replval bar",
			},

			// number replacement
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.NumberReplacement,
							details: {},
						},
					],
				},
				loc: locale({
					decimalFormat: {
						symbols: {zero: 0x30},
					},
				}),
				ctx: {
					"replkey": 7,
				},
				expected: "foo 7 bar",
			},

			// percent replacement
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.PercentReplacement,
							details: {},
						},
					],
				},
				loc: locale({
					percentFormat: {
						symbols: {zero: 0x30, percent: "%"},
						positiveSuffix: "%",
					},
				}),
				ctx: {
					"replkey": 7,
				},
				expected: "foo 7% bar",
			},

			// money replacement
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.MoneyReplacement,
							details: {currency: "currkey"},
						},
					],
				},
				loc: locale({
					moneyFormat: {
						symbols: {zero: 0x30},
						positiveSuffix: "\u00a4",
					},
				}),
				ctx: {
					"replkey": 7,
					"currkey": "EUR",
				},
				expected: "foo 7EUR bar",
			},

			// plural replacement
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.PluralReplacement,
							details: {
								type: PluralType.Cardinal,
								variants: {
									[PluralTag.Other]: {
										section: "",
										key: "",
										text: ["plural"],
										replacements: [],
									},
								},
								custom: {},
							},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey": "nan",
				},
				expected: "foo plural bar",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.PluralReplacement,
							details: {
								type: PluralType.Cardinal,
								variants: {
									[PluralTag.Few]: {
										section: "",
										key: "",
										text: ["plural"],
										replacements: [],
									},
								},
								custom: {},
							},
						},
					],
				},
				loc: locale({
					cardinalPlurals: [
						{
							tag: PluralTag.Few,
							rules: [
								{
									operand: Operand.AbsoluteValue,
									ranges: [{lowerBound: 7, upperBound: 7}],
								},
							],
						},
					],
				}),
				ctx: {
					"replkey": 7,
				},
				expected: "foo plural bar",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.PluralReplacement,
							details: {
								type: PluralType.Ordinal,
								variants: {
									[PluralTag.Few]: {
										section: "",
										key: "",
										text: ["plural"],
										replacements: [],
									},
								},
								custom: {},
							},
						},
					],
				},
				loc: locale({
					ordinalPlurals: [
						{
							tag: PluralTag.Few,
							rules: [
								{
									operand: Operand.AbsoluteValue,
									ranges: [{lowerBound: 7, upperBound: 7}],
								},
							],
						},
					],
				}),
				ctx: {
					"replkey": 7,
				},
				expected: "foo plural bar",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.PluralReplacement,
							details: {
								type: PluralType.Ordinal,
								variants: {
									[PluralTag.Other]: {
										section: "",
										key: "",
										text: ["plural"],
										replacements: [],
									},
								},
								custom: {},
							},
						},
					],
				},
				loc: locale({
					ordinalPlurals: [
						{
							tag: PluralTag.Few,
							rules: [
								{
									operand: Operand.AbsoluteValue,
									ranges: [{lowerBound: 7, upperBound: 7}],
								},
							],
						},
					],
				}),
				ctx: {
					"replkey": 7,
				},
				expected: "foo plural bar",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.PluralReplacement,
							details: {
								type: PluralType.Ordinal,
								variants: {},
								custom: {
									7: {
										section: "",
										key: "",
										text: ["plural"],
										replacements: [],
									},
								},
							},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey": 7,
				},
				expected: "foo plural bar",
			},

			// select replacement
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.SelectReplacement,
							details: {
								cases: {
									"abc": {
										section: "",
										key: "",
										text: ["select"],
										replacements: [],
									},
								},
								fallback: "",
							},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey": "abc",
				},
				expected: "foo select bar",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.SelectReplacement,
							details: {
								cases: {
									"abc": {
										section: "",
										key: "",
										text: ["select"],
										replacements: [],
									},
								},
								fallback: "abc",
							},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey": "def",
				},
				expected: "foo select bar",
			},

			// replacement positioning
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 0,
							type: ReplacementType.StringReplacement,
							details: {},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey": "abc",
				},
				expected: "abcfoo  bar",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 2,
							type: ReplacementType.StringReplacement,
							details: {},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey": "abc",
				},
				expected: "foo  barabc",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey1",
							textPos: 0,
							type: ReplacementType.StringReplacement,
							details: {},
						},
						{
							key: "replkey2",
							textPos: 0,
							type: ReplacementType.StringReplacement,
							details: {},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey1": "abc",
					"replkey2": "def",
				},
				expected: "abcdeffoo  bar",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey1",
							textPos: 1,
							type: ReplacementType.StringReplacement,
							details: {},
						},
						{
							key: "replkey2",
							textPos: 1,
							type: ReplacementType.StringReplacement,
							details: {},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey1": "abc",
					"replkey2": "def",
				},
				expected: "foo abcdef bar",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey1",
							textPos: 2,
							type: ReplacementType.StringReplacement,
							details: {},
						},
						{
							key: "replkey2",
							textPos: 2,
							type: ReplacementType.StringReplacement,
							details: {},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey1": "abc",
					"replkey2": "def",
				},
				expected: "foo  barabcdef",
			},
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey1",
							textPos: 0,
							type: ReplacementType.StringReplacement,
							details: {},
						},
						{
							key: "replkey2",
							textPos: 2,
							type: ReplacementType.StringReplacement,
							details: {},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey1": "abc",
					"replkey2": "def",
				},
				expected: "abcfoo  bardef",
			},
		];

		tests.forEach(test => {
			const tr = translator(test.loc, test.msg);
			const s = tr(test.msg.key, test.ctx);
			if(s !== test.expected) {
				t.error(`unexpected translation for "${test.expected}": ${s}`);
			}
		});
	});


	t.run("incomplete input", t => {
		const tests = [
			// missing variable
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.StringReplacement,
							details: {},
						},
					],
				},
				loc: locale(),
				ctx: {},
				expected: "foo %!(MISSING:replkey) bar",
			},

			// missing currency variable
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.MoneyReplacement,
							details: {currency: "currkey"},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey": 7,
				},
				expected: "foo %!(MISSING:currkey) bar",
			},

			// unsupported replacement type
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: 99 as ReplacementType,
							details: {},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey": "foo",
				},
				expected: "foo %!(UNSUPPORTED:ReplType-99) bar",
			},

			// invalid number type
			{
				msg: {
					section: "",
					key: "msgkey",
					text: ["foo ", " bar"],
					replacements: [
						{
							key: "replkey",
							textPos: 1,
							type: ReplacementType.NumberReplacement,
							details: {},
						},
					],
				},
				loc: locale(),
				ctx: {
					"replkey": "foo",
				},
				expected: "foo %!(INVALID:replkey) bar",
			},
		];

		tests.forEach(test => {
			const tr = translator(test.loc, test.msg);
			const s = tr(test.msg.key, test.ctx);
			if(s !== test.expected) {
				t.error(`unexpected translation for "${test.expected}": ${s}`);
			}
		});
	});
});



function translator(loc: Locale, msg: Message): Translator {
	const c = encode({version: 1, locale: loc, messages: [msg]}, Catalog);
	return readCatalog(c);
}
