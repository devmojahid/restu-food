import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function Toast() {
  const { flash } = usePage().props;
  const serverToast = flash?.toast;

  useEffect(() => {
    if (serverToast) {
      switch (serverToast.type) {
        case "success":
          toast.success(serverToast.message);
          break;
        case "error":
          toast.error(serverToast.message);
          break;
        default:
          toast(serverToast.message);
      }
    }
  }, [serverToast]);

  return null;
}
