import { Contract } from 'fabric-network';

export async function createContractListener(contract: Contract, listenerName: string, eventName: string, callback: any, options: any) {
    const listener = await contract.addContractListener(listenerName, eventName, callback, options);
    return listener;
}

export async function createBaseContractListener(contract: Contract, listenerName: string, eventName: string, callback: any, options: any) {
    const eventHub = (contract as any).getNetwork().getEventHubManager().getEventHub();
    eventHub.connect();
    const eventCallback = (...args) => callback(null, ...args.slice(1));
    const errorCallback = (...args) => callback(args[0]);
    const listener = eventHub.registerChaincodeEvent((contract as any).getChaincodeId(), eventName, eventCallback, errorCallback)
    eventHub.connect();
    return listener
}
