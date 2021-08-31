import { ObjectManager } from '../../index';
import Child2 from './Child2';
import Foo from './Foo';
import Bar from './Bar';
import Parent from './Parent';


test('child injecting', () => {
    const fooService = new Foo();
    fooService.checker = 'ok';

    ObjectManager.bindService(fooService, 'service');

    const instance = ObjectManager.getInstance(Child2);

    expect(instance.otherFooSample).toBeDefined();
    expect(instance.otherFooSample).toBeInstanceOf(Bar);
    expect(instance.otherFooSample.checker).toEqual(undefined);
    expect(instance.otherFooSample.something).toBeDefined();

    // parent properties
    expect(instance.fooService).toBeDefined();
    expect(instance.fooService).toBeInstanceOf(Foo);
    expect(instance.fooService.checker).toEqual(fooService.checker);
    expect(instance.fooService.something).toEqual(fooService.something);

    expect(instance.fooSample).toBeDefined();
    expect(instance.fooSample).toBeInstanceOf(Foo);
    expect(instance.fooSample.checker).toEqual(undefined);
    expect(instance.fooSample.something).toBeDefined();
});
