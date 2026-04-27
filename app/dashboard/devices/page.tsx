"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAreas } from "@/lib/areas/hooks";
import {
  useDevices,
  useCreateDevice,
  useUpdateDevice,
  useDeleteDevice,
} from "@/lib/devices/hooks";
import type { Device, DeviceType, DeviceStatus } from "@/lib/devices/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";

const deviceTypes: DeviceType[] = [
  "COMPUTER",
  "PRINTER",
  "SERVER",
  "NETWORK",
  "OTHER",
];
const deviceStatuses: DeviceStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "MAINTENANCE",
  "RETIRED",
];

const deviceSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  type: z.enum(deviceTypes),
  areaId: z.string().min(1, "El área es requerida"),
  serialNumber: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  ipAddress: z.string().optional(),
  status: z.enum(deviceStatuses),
  notes: z.string().optional(),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

export default function DevicesPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const { data: devices, isLoading } = useDevices();
  const { data: areas } = useAreas();
  const createDevice = useCreateDevice();
  const updateDevice = useUpdateDevice();
  const deleteDevice = useDeleteDevice();

  const form = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: "",
      type: "COMPUTER",
      areaId: "",
      serialNumber: "",
      brand: "",
      model: "",
      ipAddress: "",
      status: "ACTIVE",
      notes: "",
    },
  });

  const isPending =
    createDevice.isPending || updateDevice.isPending || deleteDevice.isPending;

  function onSubmit(data: DeviceFormData) {
    if (editingDevice) {
      updateDevice.mutate({ id: editingDevice.id, ...data });
    } else {
      createDevice.mutate(data);
    }
  }

  function onOpenChange(open: boolean) {
    setOpen(open);
    if (!open) {
      setEditingDevice(null);
      form.reset({
        name: "",
        type: "COMPUTER",
        areaId: "",
        serialNumber: "",
        brand: "",
        model: "",
        ipAddress: "",
        status: "ACTIVE",
        notes: "",
      });
    }
  }

  function startEdit(device: Device) {
    setEditingDevice(device);
    form.reset({
      name: device.name,
      type: device.type,
      areaId: device.area_id,
      serialNumber: device.serial_number || "",
      brand: device.brand || "",
      model: device.model || "",
      ipAddress: device.ip_address || "",
      status: device.status,
      notes: device.notes || "",
    });
    setOpen(true);
  }

  function handleDelete(id: string) {
    if (!confirm("¿Eliminar dispositivo?")) return;
    deleteDevice.mutate(id);
  }

  function viewIncidents(deviceId: string) {
    router.push(`/dashboard/incidencias?deviceId=${deviceId}`);
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dispositivos</h1>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogTrigger>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" /> Nuevo Dispositivo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDevice ? "Editar" : "Nuevo"} Dispositivo
              </DialogTitle>
              <DialogDescription>
                Ingrese los datos del dispositivo.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre *</label>
                  <Input {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo *</label>
                  <Select
                    value={form.watch("type")}
                    onValueChange={(v) =>
                      form.setValue("type", v as DeviceType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Área *</label>
                  <Select
                    value={form.watch("areaId")}
                    onValueChange={(v) => {
                      if (v) form.setValue("areaId", v);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {areas?.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.areaId && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.areaId.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Serial</label>
                  <Input {...form.register("serialNumber")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Marca</label>
                  <Input {...form.register("brand")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Modelo</label>
                  <Input {...form.register("model")} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">IP</label>
                  <Input {...form.register("ipAddress")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Estado</label>
                  <Select
                    value={form.watch("status")}
                    onValueChange={(v) =>
                      form.setValue("status", v as DeviceStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceStatuses.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notas</label>
                <Textarea {...form.register("notes")} rows={2} />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Área</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices?.map((device) => (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell>{device.type}</TableCell>
                <TableCell>{device.area?.name || "-"}</TableCell>
                <TableCell>{device.brand || "-"}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      device.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : device.status === "MAINTENANCE"
                          ? "bg-yellow-100 text-yellow-700"
                          : device.status === "RETIRED"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {device.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => viewIncidents(device.id)}
                    title="Incidencias"
                  >
                    <AlertTriangle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEdit(device)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(device.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!devices || devices.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-slate-500"
                >
                  No hay dispositivos registrados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
