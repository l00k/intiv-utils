import 'reflect-metadata';
import DependencyInjection from './Annotations/DependencyInjection';
import Inject from './Annotations/Inject';
import Injectable from './Annotations/Injectable';
import Singleton from './Annotations/Singleton';
import { InitializeSymbol, ReleaseSymbol } from './def';
import ObjectManager from './ObjectManager';
import ServiceWrapper from './ServiceWrapper';


export {
    ObjectManager,
    InitializeSymbol,
    ReleaseSymbol,
    ServiceWrapper,
    Inject,
    Injectable,
    Singleton,
    DependencyInjection,
};
