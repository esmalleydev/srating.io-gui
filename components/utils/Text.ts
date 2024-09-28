
class Text {
  public static levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];

    if (!a || !b) {
      return 0;
    }

    // Initialize the matrix with base case values
    for (let i = 0; i <= a.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= b.length; j++) {
      matrix[0][j] = j;
    }

    // Populate the matrix with distances
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;

        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Deletion
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + cost, // Substitution
        );
      }
    }

    // The final value is the Levenshtein distance
    return matrix[a.length][b.length];
  }

  public static toSentenceCase(str: string): string {
    if (!str) {
      return '';
    }

    // Trim the string to remove extra whitespace
    const trimmed = str.trim();

    // Convert the first letter to uppercase and the rest to lowercase
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  }
}

export default Text;
