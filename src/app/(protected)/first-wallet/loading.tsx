import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4">
          <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500"></div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Fintrack</h1>
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Setting up your wallet...</p>
        </div>
      </div>
    </div>
  );
}
