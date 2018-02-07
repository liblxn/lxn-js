import {Plural, PluralRule, PluralTag, Connective, Operand, NumberFormat} from "lxn-schema";
import {digits, Digits} from "./number";


interface Operands {
	i: number;
	v: number;
	f: number;

	// lazily calculated
	w?: number;
	t?: number;
}



export function pluralTag(v: number, nf: NumberFormat, plurals: Plural[]): PluralTag {
	const d = digits(v, 0, nf);
	const op = {
		i: d.int.reduce((res, x) => res*10 + x, 0),
		f: d.frac.reduce((res, x) => res*10 + x, 0),
		v: d.frac.length,
	};

	let p: Plural;
	for(let i = 0; i < plurals.length; ++i) {
		p = plurals[i];

		let match = false;
		for(let k = 0; k < p.rules.length; ++k) {
			match = matchRule(op, p.rules[k], d);
			if(!match) {
				// We found an operand in the conjunction that is false, i.e. our
				// whole condition evaluates to false. So we skip the conjunction.
				while(k < p.rules.length && p.rules[k].connective === Connective.Conjunction) {
					++k;
				}
			} else if(p.rules[k].connective === Connective.Disjunction) {
				// We found an operand in the disjunction that is true, i.e. our
				// whole condition evaluates to true.
				break;
			}
		}
		if(match) {
			return p.tag;
		}
	}
	return PluralTag.Other;
}


function matchRule(op: Operands, r: PluralRule, d: Digits): boolean {
	let x: number;
	switch(r.operand) {
	case Operand.AbsoluteValue: // n
		// Since the ranges contain integer values only, we do not match
		// if n has non-zero fractional digits.
		if(op.f) {
			return r.negate;
		}
		// fallthrough

	case Operand.IntegerDigits: // i
		x = op.i;
		break;

	case Operand.NumFracDigits: // v
		x = op.v;
		break;

	case Operand.NumFracDigitsNoZeros: // w
		if(op.w == null) {
			for(op.w = op.v; op.w > 0 && d.frac[op.w-1] === 0; --op.w);
		}
		x = op.w;
		break;

	case Operand.FracDigits: // f
		x = op.f;
		break;

	case Operand.FracDigitsNoZeros: // t
		if(op.t == null) {
			op.t = op.f;
			while(op.t > 0 && op.t % 10 === 0) {
				op.t /= 10;
			}
		}
		x = op.t;
		break;

	default:
		return r.negate; // ignore unknown operands
	}

	if(r.modulo) {
		x %= r.modulo;
	}
	for(let i = 0; i < r.ranges.length; ++i) {
		if(r.ranges[i].lowerBound <= x && x <= r.ranges[i].upperBound) {
			return !r.negate; // match!
		}
	}
	return r.negate;
}
