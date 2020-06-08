// x,y: coordinates, m: slope, yi: y-intercept
const blinder = {
	protan: {
		x: 0.7465,
		y: 0.2535,
		m: 1.273463,
		yi: -0.073894,
	},
	deutan: {
		x: 1.4,
		y: -0.4,
		m: 0.968437,
		yi: 0.003331,
	},
	tritan: {
		x: 0.1748,
		y: 0,
		m: 0.062921,
		yi: 0.292119,
	},
};

export type DeficiencyType =
	'deuteranomaly' |
	'deuteranopia' |
	'protanomaly' |
	'protanopia' |
	'tritanomaly' |
	'tritanopia' |
	'achromatomaly' |
	'achromatopsia';

/**
 * stats: percentages [male, female], mainly from https://en.wikipedia.org/wiki/Color_blindness
 */
export const deficiencies: Record<DeficiencyType, Deficiency> = {
	deuteranomaly: {
		name: "Deuteranomaly",
		blinder: blinder.deutan,
		anomalize: true,
		achroma: false,
		stats: "6% of males, 0.4% of females",
		description: "green-weakness",
	},
	deuteranopia: {
		name: "Deuteranopia",
		blinder: blinder.deutan,
		anomalize: false,
		achroma: false,
		stats: "1% of males",
		description: "green-blindness",
	},
	protanomaly: {
		name: "Protanomaly",
		blinder: blinder.protan,
		anomalize: true,
		achroma: false,
		stats: "1% of males, 0.01% of females",
		description: "red-weakness",
	},
	protanopia: {
		name: "Protanopia",
		blinder: blinder.protan,
		anomalize: false,
		achroma: false,
		stats: "1% of males",
		description: "red-blindness",
	},
	tritanomaly: {
		name: "Tritanomaly",
		blinder: blinder.tritan,
		anomalize: true,
		achroma: false,
		stats: "0.01% of males and females",
		description: "blue-weakness",
	},
	tritanopia: {
		name: "Tritanopia",
		blinder: blinder.tritan,
		anomalize: false,
		achroma: false,
		stats: "1% of males and females",
		description: "blue-blindness",
	},
	achromatomaly: {
		name: "Achromatomaly",
		blinder: undefined,
		anomalize: true,
		achroma: false,
		stats: "very rare", // could not find any stats
		description: "blue cone monochromacy",
	},
	achromatopsia: {
		name: "Achromatopsia",
		blinder: undefined,
		anomalize: false,
		achroma: true,
		stats: "0.0033% of males and females",
		description: "monochromacy",
	},
};

export interface Blinder
{
	x: number;
	y: number;
	m: number;
	yi: number;
}

export interface Deficiency
{
	name: string;
	blinder?: Blinder;
	anomalize: boolean;
	achroma: boolean;
	stats: string;
	description: string;
}