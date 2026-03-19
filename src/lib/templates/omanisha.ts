import { pt, ptY, getVal } from '$lib/functions/helpers';
import type { CoverState } from '$lib/types';

export const omanishaCoverTemplate = (state: CoverState, font: string) => {
	const showTo = [state.submittedTo, state.designation, state.dept, state.varsity].some(
		(f) => f.visible
	);
	const showBy = [state.submittedBy, state.studentId, state.regNo, state.session].some(
		(f) => f.visible
	);

	return {
		pageSize: 'A4',
		pageMargins: [0, 0, 0, 0],
		defaultStyle: { font: font || 'TINOS', fontSize: 12 },
		content: [
			{
				margin: [pt(20), pt(45), pt(20), 0],
				stack: [
					{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: pt(170), y2: 0, lineWidth: 0.5 }] },
					state.subtitle.visible && {
						text: getVal(state.subtitle),
						bold: true,
						alignment: 'center',
						margin: [0, pt(-10), 0, pt(5)]
					},
					state.title.visible && {
						text: getVal(state.title),
						bold: true,
						fontSize: 18,
						alignment: 'center',
						margin: [0, pt(5), 0, pt(5)]
					},
					{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: pt(170), y2: 0, lineWidth: 0.5 }] }
				].filter(Boolean)
			},

			showTo && {
				margin: [0, pt(40), 0, 0],
				alignment: 'center',
				stack: [
					{ text: 'Submitted to:', bold: true, margin: [0, 0, 0, 8] },
					state.submittedTo.visible && { text: getVal(state.submittedTo) },
					state.designation.visible && { text: getVal(state.designation) },
					state.dept.visible && { text: getVal(state.dept) },
					state.varsity.visible && { text: getVal(state.varsity) }
				].filter(Boolean)
			},

			showBy && buildSubmittedByTable(state),

			state.date.visible && {
				text: `Submission date: ${state.date.value || '_____________________'}`,
				alignment: 'center',
				absolutePosition: { x: 0, y: ptY(250, 12) }
			},
			state.dept_bottom.visible && {
				text: getVal(state.dept_bottom),
				alignment: 'center',
				absolutePosition: { x: 0, y: ptY(275, 12) }
			},
			state.varsity_bottom.visible && {
				text: getVal(state.varsity_bottom),
				bold: true,
				fontSize: 16,
				alignment: 'center',
				absolutePosition: { x: 0, y: ptY(282, 16) }
			}
		].filter(Boolean)
	};
};

function buildSubmittedByTable(state: CoverState) {
	const tableRows = [];
	if (state.submittedBy.visible)
		tableRows.push([
			{ text: 'Name', noWrap: true },
			{ text: ':', noWrap: true },
			{ text: getVal(state.submittedBy), noWrap: true }
		]);
	if (state.studentId.visible)
		tableRows.push([
			{ text: 'ID', noWrap: true },
			{ text: ':', noWrap: true },
			{ text: getVal(state.studentId), noWrap: true }
		]);
	if (state.regNo.visible)
		tableRows.push([
			{ text: 'Reg. No', noWrap: true },
			{ text: ':', noWrap: true },
			{ text: getVal(state.regNo), noWrap: true }
		]);
	if (state.session.visible)
		tableRows.push([
			{ text: 'Session', noWrap: true },
			{ text: ':', noWrap: true },
			{ text: getVal(state.session), noWrap: true }
		]);

	return {
		margin: [0, pt(25), 0, 0],
		stack: [
			{ text: 'Submitted by:', bold: true, margin: [0, 0, 0, 8], alignment: 'center' },
			{
				layout: 'noBorders',
				table: {
					widths: ['*', 'auto', '*'],
					body: [
						[
							'',
							{ layout: 'noBorders', table: { widths: [pt(20), 1, 'auto'], body: tableRows } },
							''
						]
					]
				}
			}
		]
	};
}
