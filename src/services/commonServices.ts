//commonServices.ts
export const commonServices = {
    async monthNameToNumber(monthName: String) {
        //implement below
        const monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        //@ts-ignore
        return monthNames.indexOf(monthName) + 1;
    },
    async numberToMonthName(monthNo: Number) {
        const monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        //@ts-ignore
        return monthNames[monthNo - 1];
    },
    formatISOToDate(isoString: string): string {
        if (!isoString) return '';
        
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    },

    // Optional: If you need to convert back from dd/mm/yyyy to ISO
    formatDateToISO(dateString: string): string {
        if (!dateString) return '';
        
        const [day, month, year] = dateString.split('/');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        
        return date.toISOString();
    }
}