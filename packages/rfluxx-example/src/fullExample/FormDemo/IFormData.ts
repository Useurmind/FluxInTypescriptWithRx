/**
 * Interface of the data managed in the form.
 */
export interface IFormData
{
    id: number;
    firstName: string;
    lastName: string;
    someSelectableString: string;
    selectableSubobject: ISubobject;

    /**
     * In Json dates are represented as strings.
     * we want to introduce the least amount of data conversion need.
     */
    birthdate: string;
}

export interface ISubobject
{
    id: number;
    caption: string;
}
