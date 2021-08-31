import { ReleaseSymbol } from './ObjectManager';


export default abstract class ServiceWrapper<T>
{

    public constructor(
        public service : T
    )
    {}

    public abstract [ReleaseSymbol]();

}
