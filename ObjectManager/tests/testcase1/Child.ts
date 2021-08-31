import { Inject } from '../../index';
import Foo from './Foo';
import Parent from './Parent';


export default class Child
    extends Parent
{

    @Inject()
    public otherFooSample : Foo;

    @Inject({ name: 'service' })
    public sameFooService : Foo;

}
