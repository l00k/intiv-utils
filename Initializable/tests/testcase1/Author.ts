import { Property, Initializable, Initialize } from '../../../Initializable';
import Company from './Company';
import User from './User';


@Initialize()
export default class Author
    extends User<Author>
{

    public pseudo : string = 'pseudo';

    @Property()
    public company : Company;

}
