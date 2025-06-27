"use client";

import { useState } from "react";
import { useCardano } from "@/context/CardanoContext";
import type { Vote } from "@/types/Utils";
import { DaoTxButton } from "./buttons/DAO";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  VoteIcon,
  Settings,
  Send,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function TxButtons() {
  const { address } = useCardano();
  const [proposalId, setProposalId] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [vote, setVote] = useState<Vote | null>(null);
  const [action, setAction] = useState<
    | "ValidatorAdd"
    | "ValidatorRemove"
    | "FeeAmountUpdate"
    | "FeeAddressUpdate"
    | null
  >(null);
  const [actionAddress, setActionAddress] = useState<string>("");
  const [actionAmount, setActionAmount] = useState<string>("");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-teal-800 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            DAO Transaction Interface
          </CardTitle>
          <CardDescription className="text-teal-600">
            Manage proposals, voting, and DAO operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          Connected Wallet: {address?.slice(0, 10)}......{address?.slice(-15)}
        </CardContent>
      </Card>

      {/* Proposal Configuration */}
      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-teal-700 flex items-center gap-2">
            <Send className="w-5 h-5" />
            Proposal Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proposalId" className="text-teal-700 font-medium">
              Proposal ID
            </Label>
            <Input
              id="proposalId"
              type="text"
              placeholder="Enter proposal ID"
              className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
              value={proposalId}
              onChange={(e) => setProposalId(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <Label className="text-teal-700 font-medium">Action Type</Label>
              <Select
                value={action || ""}
                onValueChange={(value) =>
                  setAction(
                    value as
                      | "ValidatorAdd"
                      | "ValidatorRemove"
                      | "FeeAmountUpdate"
                      | "FeeAddressUpdate"
                      | null
                  )
                }
              >
                <SelectTrigger className="border-teal-300 focus:border-teal-500 focus:ring-teal-500">
                  <SelectValue placeholder="Select an action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ValidatorAdd">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Add
                      </Badge>
                      Validator Add
                    </div>
                  </SelectItem>
                  <SelectItem value="ValidatorRemove">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200"
                      >
                        Remove
                      </Badge>
                      Validator Remove
                    </div>
                  </SelectItem>
                  <SelectItem value="FeeAmountUpdate">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        Update
                      </Badge>
                      Fee Amount Update
                    </div>
                  </SelectItem>
                  <SelectItem value="FeeAddressUpdate">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        Update
                      </Badge>
                      Fee Address Update
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-teal-700 font-medium">Vote</Label>

              <Select
                value={vote || ""}
                onValueChange={(value) => setVote(value as Vote)}
              >
                <SelectTrigger className="border-teal-300 focus:border-teal-500 focus:ring-teal-500 mb-2">
                  <SelectValue placeholder="Select vote" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Yes
                    </div>
                  </SelectItem>
                  <SelectItem value="No">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      No
                    </div>
                  </SelectItem>
                  <SelectItem value="Abstain">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                      Abstain
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional Inputs */}
          {(action === "ValidatorAdd" ||
            action === "ValidatorRemove" ||
            action === "FeeAddressUpdate") && (
            <div className="space-y-2">
              <Label
                htmlFor="actionAddress"
                className="text-teal-700 font-medium"
              >
                Address
              </Label>
              <Input
                id="actionAddress"
                type="text"
                placeholder="Enter address"
                className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                value={actionAddress}
                onChange={(e) => setActionAddress(e.target.value)}
              />
            </div>
          )}

          {action === "FeeAmountUpdate" && (
            <div className="space-y-2">
              <Label
                htmlFor="actionAmount"
                className="text-teal-700 font-medium"
              >
                Amount
              </Label>
              <Input
                id="actionAmount"
                type="number"
                placeholder="Enter amount"
                className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions Section */}
      <Card className="border-teal-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-teal-700 flex items-center gap-2">
            <VoteIcon className="w-5 h-5" />
            Proposal Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Submit Proposal */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-700">Submit</span>
              </div>
              <DaoTxButton
                name="Submit Proposal"
                color="teal"
                proposalType="Submit"
                proposalId={proposalId}
                action={action}
                actionAddress={actionAddress}
                actionAmount={actionAmount}
                vote={vote}
                setResult={setResult}
              />
            </div>

            {/* Vote Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <VoteIcon className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-700">Vote</span>
              </div>

              <DaoTxButton
                name="Vote Proposal"
                color="teal"
                proposalType="Vote"
                proposalId={proposalId}
                action={action}
                actionAddress={actionAddress}
                actionAmount={actionAmount}
                vote={vote}
                setResult={setResult}
              />
            </div>

            {/* Execute Proposal */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-700">Execute</span>
              </div>
              <DaoTxButton
                name="Execute Proposal"
                color="teal"
                proposalType="Execute"
                proposalId={proposalId}
                action={action}
                actionAddress={actionAddress}
                actionAmount={actionAmount}
                vote={vote}
                setResult={setResult}
              />
            </div>

            {/* Reject Proposal */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-teal-700">Reject</span>
              </div>
              <DaoTxButton
                name="Reject Proposal"
                color="teal"
                proposalType="Reject"
                proposalId={proposalId}
                action={action}
                actionAddress={actionAddress}
                actionAmount={actionAmount}
                vote={vote}
                setResult={setResult}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card className="border-teal-200 bg-teal-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-teal-700">
              Transaction Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-lg border border-teal-200">
              <p className="text-teal-800 font-mono text-sm break-all">
                {result}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
