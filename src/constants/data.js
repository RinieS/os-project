const techDataSchema = {
	firstName: '',
	lastName: '',
	email: '',
	qualification: '',
	summary: '',
	profileImg: '',
	otherInfo: {
		linkedinUrl: '',
		githubUrl: '',
		resume: '',
	},
	skills: [{ skill: '' }],
	projects: [
		{
			projectName: '',
			description: '',
		},
	],
};

const RecDataSchema ={
	firstName: '',
	lastName: '',
	email: '',
	qualification: '',
	linkedinUrl: '',
	companyName: '',
	companyInfo: '',
	phone:  '',

}

const formInputs = [
	{
		sectionTitle: 'Personal Info',
		fields: [
			{ 
				name: 'firstName', 
				label: 'First Name', 
				type: 'text', 
				placeholder: 'Name' },
			{
				name: 'lastName',
				label: 'Last Name',
				type: 'text',
				placeholder: 'Last Name',
			},
			{ name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
			{ name: 'qualification', label: 'Qualification', type: 'text', placeholder: 'Back End Developer' },
			{
				name: 'linkedinUrl',
				label: 'LinkedIn URL',
				type: 'text',
				placeholder: 'LinkedIn URL',
			},
			{
				name: 'githubUrl',
				label: 'GitHub URL',
				type: 'text',
				placeholder: 'GitHub URL',
			},
		],
	},
	{
		sectionTitle: 'About Info',
		fields: [
			{
				name: 'summary',
				label: 'Summary',
				type: 'textArea',
				placeholder: 'Summary',
			},
			// {
			// 	name: 'interest',
			// 	label: 'Interest',
			// 	textArea: 'true',
			// 	placeholder: 'Interest',
			// },
		],
	},
];


const recFormInputs = [
	{
		sectionTitle: 'Personal Info',
		fields: [
			{ 
				name: 'firstName', 
				label: 'First Name', 
				type: 'text', 
				placeholder: 'Name' },
			{
				name: 'lastName',
				label: 'Last Name',
				type: 'text',
				placeholder: 'Last Name',
			},
			{ name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
			{ name: 'qualification', label: 'Qualification', type: 'text', placeholder: 'Back End Developer' },
			{
				name: 'linkedinUrl',
				label: 'LinkedIn URL',
				type: 'text',
				placeholder: 'LinkedIn URL',
			},
			
		],
	},
	{
		sectionTitle: 'About Info',
		fields: [
			{
				name: 'companyName',
				label: 'Company Name',
				type: 'text',
				placeholder: 'Company',
			},
			{
				name: 'companyInfo',
				label: 'About Us',
				type: 'textArea',
				placeholder: '',
			},
			
		],
	},
];

export { techDataSchema, formInputs, RecDataSchema, recFormInputs };
