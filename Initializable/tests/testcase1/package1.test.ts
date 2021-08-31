import ValidationResult from '../../../Validator/ValidationResult';
import Author from './Author';
import Company from './Company';
import User from './User';


test('unchanged initial values User', () => {
    const user = new User();
    expect(user.firstname).toEqual('firstname');
    expect(user.lastname).toEqual('lastname');
    expect(user.active).toEqual(false);
})

test('unchanged initial values Author', () => {
    const author = new Author();
    expect(author.firstname).toEqual('firstname');
    expect(author.lastname).toEqual('lastname');
    expect(author.pseudo).toEqual('pseudo');
    expect(author.active).toEqual(false);
})

test('properly changed by constructor', () => {
    const author = new Author({
        active: true,
        pseudo: 'other',
        company: {
            name: 'sample',
            active: true,
        }
    });
    expect(author.pseudo).toEqual('other');
    expect(author.active).toEqual(true);
    expect(author.company).toBeInstanceOf(Company);
    expect(author.company.name).toEqual('sample');
    expect(author.company.active).toEqual(true);
})

test('properly changed by setData()', () => {
    const author = new Author();
    author.setData({
        active: true,
        pseudo: 'other',
        company: {
            name: 'sample',
            active: true,
        }
    })
    expect(author.pseudo).toEqual('other');
    expect(author.active).toEqual(true);
    expect(author.company).toBeInstanceOf(Company);
    expect(author.company.name).toEqual('sample');
    expect(author.company.active).toEqual(true);
})

