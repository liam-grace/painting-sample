/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/


package org.hyperledger.fabric.example;

import java.util.List;
import java.util.Map;

import com.google.protobuf.ByteString;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hyperledger.fabric.shim.ChaincodeBase;
import org.hyperledger.fabric.shim.ChaincodeStub;

import static java.nio.charset.StandardCharsets.UTF_8;

public class SimpleChaincode extends ChaincodeBase {

    private static Log _logger = LogFactory.getLog(SimpleChaincode.class);

    @Override
    public Response init(ChaincodeStub stub) {
        _logger.info("Init java upgraded simple chaincode");
        return newSuccessResponse("Success");
    }

    @Override
    public Response invoke(ChaincodeStub stub) {
        try {
            _logger.info("Invoke java simple chaincode");
            String func = stub.getFunction();
            List<String> params = stub.getParameters();
            if (func.equals("move")) {
                return move(stub, params);
            }
            if (func.equals("delete")) {
                return delete(stub, params);
            }
            if (func.equals("query")) {
                return query(stub, params);
            }
            if (func.equals("throwError")) {
                return newErrorResponse("throwError: an error occurred");
            }
            if (func.equals("testTransient")) {
                return testTransient(stub, params);
            }
            return newErrorResponse("Invalid invoke function name. Expecting one of: [\"move\", \"delete\", \"query\"]");
        } catch (Throwable e) {
            return newErrorResponse(e);
        }
    }

    private Response move(ChaincodeStub stub, List<String> args) {
        if (args.size() != 3) {
            return newErrorResponse("Incorrect number of arguments. Expecting 3");
        }
        String accountFromKey = args.get(0);
        String accountToKey = args.get(1);

        String accountFromValueStr = stub.getStringState(accountFromKey);
        if (accountFromValueStr == null) {
            return newErrorResponse(String.format("Entity %s not found", accountFromKey));
        }
        int accountFromValue = Integer.parseInt(accountFromValueStr);

        String accountToValueStr = stub.getStringState(accountToKey);
        if (accountToValueStr == null) {
            return newErrorResponse(String.format("Entity %s not found", accountToKey));
        }
        int accountToValue = Integer.parseInt(accountToValueStr);

        int amount = Integer.parseInt(args.get(2));

        if (amount > accountFromValue) {
            return newErrorResponse(String.format("not enough money in account %s", accountFromKey));
        }

        accountFromValue -= amount;
        accountToValue += amount;
		accountToValue += 10; //new version chaincode gives a bonus

        _logger.info(String.format("new value of A: %s", accountFromValue));
        _logger.info(String.format("new value of B: %s", accountToValue));

        stub.putStringState(accountFromKey, Integer.toString(accountFromValue));
        stub.putStringState(accountToKey, Integer.toString(accountToValue));

        _logger.info("Transfer complete");
        return newSuccessResponse("move succeed",ByteString.copyFrom("move succeed", UTF_8).toByteArray());
    }

    // Deletes an entity from state
    private Response delete(ChaincodeStub stub, List<String> args) {
        if (args.size() != 1) {
            return newErrorResponse("Incorrect number of arguments. Expecting 1");
        }
        String key = args.get(0);
        // Delete the key from the state in ledger
        stub.delState(key);
        return newSuccessResponse();
    }

    // query callback representing the query of a chaincode
    private Response query(ChaincodeStub stub, List<String> args) {
        if (args.size() != 1) {
            return newErrorResponse("Incorrect number of arguments. Expecting name of the person to query");
        }
        String key = args.get(0);
        //byte[] stateBytes
        String val = stub.getStringState(key);
        if (val == null) {
            return newErrorResponse(String.format("Error: state for %s is null", key));
        }
        _logger.info(String.format("Query Response:\nName: %s, Amount: %s\n", key, val));
        return newSuccessResponse(val, ByteString.copyFrom(val, UTF_8).toByteArray());
    }

	// check on the transient data
    private Response testTransient(ChaincodeStub stub, List<String> args) {
		try {
			Map<String, byte[]> transientMap = stub.getTransient();
			String key = args.get(0);
			if (transientMap.containsKey(key) && transientMap.get(key) != null) {
				return newSuccessResponse(transientMap.get(key));
			}
		} catch(Throwable e) {
			_logger.error("Problem getting the transientMap" + e);
		}
		return newErrorResponse("Did not find expected transient map in the proposal");
    }

    public static void main(String[] args) {
        new SimpleChaincode().start(args);
    }

}
