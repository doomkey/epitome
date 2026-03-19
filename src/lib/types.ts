export interface Field {
	value: string;
	visible: boolean;
	placeholder: string;
}

export interface CoverState {
	subtitle: Field;
	title: Field;
	submittedTo: Field;
	designation: Field;
	dept: Field;
	dept_bottom: Field;
	varsity: Field;
	varsity_bottom: Field;
	submittedBy: Field;
	studentId: Field;
	regNo: Field;
	session: Field;
	date: Field;
}
