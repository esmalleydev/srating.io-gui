import { useAppSelector } from '@/redux/hooks';


/**
 * This class helps simplify the division logic
 */
class Division {
  /**
   * Get the division ID for FBS
   */
  public static getFBS(): string {
    return 'bf258a3f-3b4a-11ef-94bc-2a93761010b8';
  }

  /**
   * Get the division ID for FCS
   */
  public static getFCS(): string {
    return 'bf4a4dac-3b4a-11ef-94bc-2a93761010b8';
  }

  /**
   * Get the division ID for D1
   */
  public static getD1(): string {
    return 'bf602dc4-3b4a-11ef-94bc-2a93761010b8';
  }

  /**
   * Get the division ID for D2
   */
  public static getD2(): string {
    return 'bf891a3f-3b4a-11ef-94bc-2a93761010b8';
  }

  /**
   * Get the division ID for D3
   */
  public static getD3(): string {
    return 'bf9ea506-3b4a-11ef-94bc-2a93761010b8';
  }

  /**
   * Is the current division FBS?
   */
  public static isFBS(): boolean {
    const division_id = useAppSelector((state) => state.organizationReducer.division_id);
    return (division_id === this.getFBS());
  }

  /**
   * Is the current division FCS?
   */
  public static isFCS(): boolean {
    const division_id = useAppSelector((state) => state.organizationReducer.division_id);
    return (division_id === this.getFCS());
  }

  /**
   * Is the current division D1?
   */
  public static isD1(): boolean {
    const division_id = useAppSelector((state) => state.organizationReducer.division_id);
    return (division_id === this.getD1());
  }

  /**
   * Is the current division D2?
   */
  public static isD2(): boolean {
    const division_id = useAppSelector((state) => state.organizationReducer.division_id);
    return (division_id === this.getD2());
  }

  /**
   * Is the current division D3?
   */
  public static isD3(): boolean {
    const division_id = useAppSelector((state) => state.organizationReducer.division_id);
    return (division_id === this.getD3());
  }
}

export default Division;
