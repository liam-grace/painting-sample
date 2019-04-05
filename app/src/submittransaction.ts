import { Contract } from 'fabric-network';

export async function submitTransaction(contract: Contract, transactionName: string, args: string[]) {
    const resp = await contract.submitTransaction(transactionName, ...args);
    console.log('submitted transaction');
    return resp;
}
