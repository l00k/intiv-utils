import { Inject } from '../../index';
import Foo from './Foo';


export default class Parent
{

    @Inject()
    public fooSample : Foo;

    @Inject({ name: 'service' })
    public fooService : Foo;

}
