"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: string;
}

export function PaymentActions({ order }: { order: Order }) {
  const router = useRouter();
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      if (!res.ok) throw new Error();

      toast.success("อนุมัติสำเร็จ");
      router.refresh();
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("กรุณาระบุเหตุผล");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason }),
      });

      if (!res.ok) throw new Error();

      toast.success("ปฏิเสธสำเร็จ");
      setIsRejectOpen(false);
      router.refresh();
    } catch {
      toast.error("เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={handleApprove} disabled={isLoading} size="sm">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4 mr-1" />
          )}
          อนุมัติ
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsRejectOpen(true)}
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-1" />
          ปฏิเสธ
        </Button>
      </div>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ปฏิเสธการชำระเงิน</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>เหตุผลในการปฏิเสธ</Label>
              <Textarea
                placeholder="กรุณาระบุเหตุผล..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              ยกเลิก
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              ปฏิเสธ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
