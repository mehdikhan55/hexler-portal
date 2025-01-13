// EditCareerDialog.tsx
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Career } from "@/types/Career";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditCareerDialogProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (career: Career) => void;
    career: Career;
}

const EditCareerDialog: React.FC<EditCareerDialogProps> = ({ 
    show, 
    onClose, 
    onSubmit, 
    career 
}) => {
    const [name, setName] = React.useState(career.name);
    const [description, setDescription] = React.useState(career.description || "");
    const [active, setActive] = React.useState(career.isActive);

    React.useEffect(() => {
        setName(career.name);
        setDescription(career.description || "");
        setActive(career.isActive);
    }, [career]);

    const handleSubmit = () => {
        if (!name) {
            alert("Career name is required!");
            return;
        }

        onSubmit({
            ...career,
            name,
            description,
            isActive: active
        });
    };

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Career</DialogTitle>
                    <DialogDescription>Edit the career details below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                            placeholder="Optional"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select
                            value={active ? "active" : "inactive"}
                            onValueChange={(value) => setActive(value === "active")}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditCareerDialog;