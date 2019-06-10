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
}

export interface ISubobject
{
    id: number;
    caption: string;
}
