import { pt, ptY, getVal } from '$lib/functions/helpers';
import type { CoverState } from '$lib/types';

export const omabossaCoverTemplate = (state: CoverState, font: string) => {
	return {
		pageSize: 'A4',
		pageMargins: [70, 40, 70, 40],
		defaultStyle: { font: font || 'TINOS', fontSize: 11 },
		content: [
			{
				table: {
					widths: ['*'],

					heights: [100, 450, 'auto'],
					body: [
						[
							{
								stack: [
									state.varsity_bottom.visible && {
										text: getVal(state.varsity_bottom).toUpperCase(),
										style: 'uni'
									},
									state.dept_bottom.visible && {
										text: getVal(state.dept_bottom),
										style: 'headerSub'
									}
								].filter(Boolean),
								alignment: 'center'
							}
						],

						[
							{
								stack: [
									state.subtitle.visible && {
										text: getVal(state.subtitle),
										italics: true,
										alignment: 'center',
										margin: [0, 0, 0, 10]
									},
									state.title.visible && {
										text: getVal(state.title),
										bold: true,
										fontSize: 24,
										alignment: 'center',
										color: '#1a1a1a'
									}
								].filter(Boolean),

								margin: [0, 150, 0, 0]
							}
						],

						[
							{
								stack: [
									{
										columns: [
											buildBlock(state) || { text: '' },
											{
												width: '45%',
												stack: [
													{
														text: 'SUBMITTED BY',
														style: 'sectionLabel',
														margin: [0, 0, 0, 10]
													},
													buildByBlock(state) || { text: '' }
												]
											}
										],
										columnGap: 20
									},
									state.date.visible
										? {
												text: [
													{ text: 'DATE OF SUBMISSION: ', bold: true },
													{ text: state.date.value || '_____________________' }
												],
												alignment: 'center',
												margin: [0, 40, 0, 0]
											}
										: { text: '' }
								]
							}
						]
					]
				},
				layout: 'noBorders'
			}
		],

		styles: {
			uni: { fontSize: 15, bold: true },
			headerMain: { fontSize: 18, bold: true },
			headerSub: { fontSize: 14, margin: [0, 5, 0, 0] },
			sectionLabel: { fontSize: 9, color: '#666666', bold: true }
		}
	};
};

function buildBlock(state: CoverState) {
	const showTo = [state.submittedTo, state.designation, state.dept, state.varsity].some(
		(f) => f.visible
	);
	if (!showTo) return { width: '55%', text: '' };

	return {
		width: '55%',
		stack: [
			{ text: 'SUBMITTED TO', style: 'sectionLabel', margin: [0, 0, 0, 10] },
			{
				stack: [
					state.submittedTo.visible && {
						text: getVal(state.submittedTo),
						bold: true,
						fontSize: 13
					},
					state.designation.visible && { text: getVal(state.designation), italics: true },
					state.dept.visible && { text: getVal(state.dept) },
					state.varsity.visible && { text: getVal(state.varsity) }
				].filter(Boolean)
			}
		]
	};
}

function buildByBlock(state: CoverState) {
	const tableRows = [];
	if (state.submittedBy.visible)
		tableRows.push([{ text: 'Name', bold: true }, ' ', getVal(state.submittedBy)]);
	if (state.studentId.visible)
		tableRows.push([{ text: 'ID', bold: true }, ' ', getVal(state.studentId)]);
	if (state.regNo.visible) tableRows.push([{ text: 'Reg', bold: true }, ' ', getVal(state.regNo)]);
	if (state.session.visible)
		tableRows.push([{ text: 'Session', bold: true }, ' ', getVal(state.session)]);

	if (tableRows.length === 0) return null;

	return {
		table: {
			widths: ['auto', pt(2), '*'],
			body: tableRows
		},
		layout: {
			hLineWidth: () => 0.5,
			vLineWidth: () => 0,
			hLineColor: () => '#e0e0e0',
			paddingLeft: () => 0,
			paddingRight: () => 0,
			paddingTop: () => 4,
			paddingBottom: () => 4
		}
	};
}
