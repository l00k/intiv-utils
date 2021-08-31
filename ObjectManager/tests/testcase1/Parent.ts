import { Inject } from '../../index';
import Foo from './Foo';


export default class Parent
{

    @Inject()
    public fooSample : Foo;

    @Inject('service')
    public fooService : Foo;

}
