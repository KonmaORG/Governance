import { MintIdentificationButton } from "@/components/buttons/identification";
import { AttachConfigForm } from "@/components/ConfigDatumForm";

export default function Admin() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <h1 className="text-lg font-semibold text-teal-800 mb-4">
          ONLY FOR ONE TIME USAGE - Calling again will break the rest of the
          code
        </h1>
        <MintIdentificationButton
          name="Mint Identification Token"
          color="teal"
        />
      </div>

      <div className="bg-white border border-teal-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-teal-800 mb-6">
          Configure Datum Parameters
        </h2>
        <AttachConfigForm />
      </div>
    </div>
  );
}
