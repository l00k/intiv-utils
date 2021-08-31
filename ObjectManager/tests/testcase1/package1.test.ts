import { ObjectManager } from '../../index';
import Child from './Child';
import Foo from './Foo';
import Parent from './Parent';


test('parent injecting', () => {
    const fooService = new Foo();
    fooService.checker = 'ok';

    ObjectManager.bindService(fooService, 'service');

    const instance = ObjectManager.getInstance(Parent);

    expect(instance.fooService).toBeDefined();
    expect(instance.fooService).toBeInstanceOf(Foo);
    expect(instance.fooService.checker).toEqual(fooService.checker);
    expect(instance.fooService.something).toEqual(fooService.something);

    expect(instance.fooSample).toBeDefined();
    expect(instance.fooSample).toBeInstanceOf(Foo);
    expect(instance.fooSample.checker).toEqual(undefined);
    expect(instance.fooSample.something).toBeDefined();
});
