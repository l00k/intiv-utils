import { Inject } from '../../index';
import Bar from './Bar';
import Parent from './Parent';


export default class Child2
    extends Parent
{

    @Inject()
    public otherFooSample : Bar;

}
