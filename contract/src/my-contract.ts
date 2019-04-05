/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';

export class MyContract extends Contract {

    public async instantiate(ctx: Context): Promise<any> {
        console.info('Contract instantiated')
    }

    public async sellPainting(ctx: Context, paintingName: string): Promise<any> {
        console.info('sellPainting', paintingName);
        ctx.stub.setEvent('sell', Buffer.from(paintingName));
    }

    public async buyPainting(ctx: Context, paintingName: string): Promise<any> {
        console.info('buyPainting', paintingName);
        ctx.stub.setEvent('buy', Buffer.from(paintingName));
    }

}
