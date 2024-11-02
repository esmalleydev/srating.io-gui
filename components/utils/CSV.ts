
/**
 * Everything to help with CSV generation
 */
class CSV {
  /**
   * Convert an object to a CSV file and then download it
   */
  public static download(data: object): void {
    const rows: string[] = [];

    let setHeaders = false;
    let headers: string[] = [];
    for (const id in data) {
      const row = data[id];

      if (!setHeaders) {
        headers = Object.keys(row);
        rows.push(headers.join(','));
        setHeaders = true;
      }

      const values = headers.map((header) => JSON.stringify(row[header] || ''));
      rows.push(values.join(','));
    }

    const content = rows.join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'srating-data.csv';

    // Trigger download and clean up
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  }
}

export default CSV;
