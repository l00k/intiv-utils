import { Property, Initializable, Initialize } from '../../../Initializable';
import Company from './Company';


@Initialize()
export default class User<T>
    extends Initializable<T & User<T>>
{

    public firstname : string = 'firstname';

    public lastname : string = 'lastname';

    public active : boolean = false;

}
