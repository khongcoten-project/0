import { isAfterDate } from '../util/Util';

// RecordDetermination

export enum RecordDetermination {
	Pure = 1,
	IndeterminateNearPure = 2,
	Indeterminate = 3,
	IndeterminateNearDirty = 4,
	Dirty = 5,
	Argue = 6,
}

export function getNameOfRecordDetermination(value: RecordDetermination) {
	switch (value) {
		default:
			return null;
		case RecordDetermination.Pure:
			return '明确洁';
		case RecordDetermination.IndeterminateNearPure:
			return '默认偏洁';
		case RecordDetermination.Indeterminate:
			return '默认';
		case RecordDetermination.IndeterminateNearDirty:
			return '默认非洁';
		case RecordDetermination.Dirty:
			return '明确非洁';
		case RecordDetermination.Argue:
			return '争议';
	}
}

export const setOfRecordDetermination = [
	RecordDetermination.Pure,
	RecordDetermination.IndeterminateNearPure,
	RecordDetermination.Indeterminate,
	RecordDetermination.IndeterminateNearDirty,
	RecordDetermination.Dirty,
	RecordDetermination.Argue,
];

export function getNameOfRecordDeterminationMaybeUnknown(value: RecordDetermination | null) {
	switch (value) {
		default:
			return null;
		case null:
			return '未知';
		case RecordDetermination.Pure:
			return '明确洁';
		case RecordDetermination.IndeterminateNearPure:
			return '默认偏洁';
		case RecordDetermination.Indeterminate:
			return '默认';
		case RecordDetermination.IndeterminateNearDirty:
			return '默认非洁';
		case RecordDetermination.Dirty:
			return '明确非洁';
		case RecordDetermination.Argue:
			return '争议';
	}
}

export function isDeterminateRecordDetermination(determination: RecordDetermination) {
	return determination == RecordDetermination.Pure
		|| determination == RecordDetermination.Dirty;
}

export function isPureRecordDetermination(determination: RecordDetermination) {
	return determination == RecordDetermination.Pure;
}

export function isLikePureRecordDetermination(determination: RecordDetermination) {
	return determination == RecordDetermination.Pure
		|| determination == RecordDetermination.IndeterminateNearPure
		|| determination == RecordDetermination.Indeterminate;
}

export function isLikeDirtyRecordDetermination(determination: RecordDetermination) {
	return determination == RecordDetermination.Dirty
		|| determination == RecordDetermination.IndeterminateNearDirty;
}

// SexualOrientation

export enum SexualOrientationCategory {
	BG = 1,
	BL = 2,
	GL = 3,
	Other = 4,
}

export function getNameOfSexualOrientationCategory(value: SexualOrientationCategory) {
	switch (value) {
		default:
			return null;
		case SexualOrientationCategory.BG:
			return 'BG';
		case SexualOrientationCategory.BL:
			return 'BL';
		case SexualOrientationCategory.GL:
			return 'GL';
		case SexualOrientationCategory.Other:
			return '其他';
	}
}

export const setOfSexualOrientationCategory = [
	SexualOrientationCategory.BG,
	SexualOrientationCategory.BL,
	SexualOrientationCategory.GL,
	SexualOrientationCategory.Other,
];

// Record

export interface RecordComment {
	message: string;
	disgustful: boolean;
}

export interface RecordCommentWithInfo extends RecordComment {
	commenter: string;
	commenterName: string;
	date: string;
}

export interface RecordCheckInfo {
	checker: string;
	checkerName: string;
	date: string;
	determination: RecordDetermination | null;
	message: string;
}

export interface Record {
	id: string;
	submitter: string;
	submitterName: string;
	description: string | null;
	date: string;
	name: string;
	author: string | null;
	sexual: SexualOrientationCategory;
	source: string | null;
	determination: RecordDetermination | null;
	reason: RecordComment[];
	introduction: RecordComment[];
	correct: RecordCommentWithInfo[];
	comment: RecordCommentWithInfo[];
	check: RecordCheckInfo[];
}

// RawRecord

export interface RawRecord {
	description: string | null;
	name: string | null;
	author: string | null;
	sexual: SexualOrientationCategory | null;
	source: string | null;
	determination: RecordDetermination | null;
	reason: RecordComment[];
	introduction: RecordComment[];
}

export function makeDefaultRawRecordTemplate() {
	return {
		description: null,
		name: null,
		author: null,
		sexual: null,
		source: null,
		determination: null,
		reason: [],
		introduction: []
	} as RawRecord;
}

// FindRule

export enum RecordFindTarget {
	Name = 'name',
	Author = 'author',
	Message = 'message',
}

export interface RecordFindRule {
	submitterName: string | null;
	fromUnchecked: boolean;
	fromChecked: boolean;
	sexual: SexualOrientationCategory[];
	target: RecordFindTarget;
	keyword: string;
}

export function makeDefaultRecordFindRule() {
	return {
		submitterName: null,
		fromUnchecked: true,
		fromChecked: true,
		sexual: new Array(...setOfSexualOrientationCategory),
		target: RecordFindTarget.Message,
		keyword: ''
	} as RecordFindRule;
}

// other

export function isCheckedOfRecord(data: Record) {
	return data.check.length != 0 && isAfterDate(data.date, data.check[data.check.length - 1].date);
}

export function getRealDeterminationOfRecord(data: Record) {
	if (isCheckedOfRecord(data)) {
		return data.check[data.check.length - 1].determination;
	} else {
		return data.determination;
	}
}
