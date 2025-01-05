'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/Expense/date-picker-demo";
import LoadingOverlay from '@/components/Common/LoadingOverlay';
import { invoiceServices } from '@/services/invoiceServices';

const page = () => {
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    ntnNumber: '9252785',
    regNumber: '0215372',
    invoiceDate: new Date(),
    dueDate: new Date(),
    clientDetails: {
      name: '',
      company: '',
      address: ''
    },
    items: [
      { description: '', quantity: 1, price: 0 }
    ],
    credit: 0
  });

  const handleInputChange = (field: string, value: any) => {
    setInvoiceData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            //@ts-ignore
            ...prev[parent],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = invoiceData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: updatedItems });
  };

  const calculateSubTotal = () => {
    return invoiceData.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
  };

  const calculateTotal = () => {
    return calculateSubTotal() + invoiceData.credit;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validate required fields
      if (!invoiceData.clientDetails.name || !invoiceData.clientDetails.address) {
        throw new Error('Please fill in all required fields');
      }

      const result = await invoiceServices.generateInvoice(invoiceData);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Optionally reset form
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay />}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Generate Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ntnNumber">NTN Number</Label>
                <Input
                  id="ntnNumber"
                  value={invoiceData.ntnNumber}
                  onChange={(e) => handleInputChange('ntnNumber', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="regNumber">Registration Number</Label>
                <Input
                  id="regNumber"
                  value={invoiceData.regNumber}
                  onChange={(e) => handleInputChange('regNumber', e.target.value)}
                />
              </div>
            </div>

            {/* Dates Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Invoice Date</Label>
                <DatePicker
                  selectedDate={invoiceData.invoiceDate}
                  onDateChange={(date) => handleInputChange('invoiceDate', date)}
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <DatePicker
                  selectedDate={invoiceData.dueDate}
                  onDateChange={(date) => handleInputChange('dueDate', date)}
                />
              </div>
            </div>

            {/* Client Details Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Client Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={invoiceData.clientDetails.name}
                    onChange={(e) => handleInputChange('clientDetails.name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientCompany">Company</Label>
                  <Input
                    id="clientCompany"
                    value={invoiceData.clientDetails.company}
                    onChange={(e) => handleInputChange('clientDetails.company', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="clientAddress">Address *</Label>
                  <Input
                    id="clientAddress"
                    value={invoiceData.clientDetails.address}
                    onChange={(e) => handleInputChange('clientDetails.address', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base">Items</h3>
              {invoiceData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-4">
                    <Input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, 'description', e.target.value)
                      }
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Input
                      placeholder="Price"
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, 'price', parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="md:col-span-1 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addItem} className="w-full">
                Add Item
              </Button>
            </div>

            {/* Credit Section */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="credit">Credit</Label>
                <Input
                  id="credit"
                  type="number"
                  value={invoiceData.credit}
                  onChange={(e) => handleInputChange('credit', parseFloat(e.target.value))}
                />
              </div>
            </div>

            {/* Totals Section */}
              <div>
                <h5 className="font-semibold">Subtotal: Rs. {calculateSubTotal()}</h5>
                <h5 className="font-semibold">Credit: Rs. {invoiceData.credit}</h5>
                <h3 className="font-semibold">Total: Rs. {calculateTotal()}</h3>
              </div>

            <div className="flex justify-end space-x-4">
              <Button type="submit" className="w-32" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Invoice'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default page;
