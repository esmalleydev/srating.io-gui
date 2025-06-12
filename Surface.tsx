'use server';

import { notFound } from 'next/navigation';
import CBB from './components/helpers/CBB';
import CFB from './components/helpers/CFB';
import Division from './components/helpers/Division';
import Organization from './components/helpers/Organization';

class Surface {
  constructor(args) {
    if (args.sport) {
      this.sport = args.sport;
    }
  }

  private sport: string | null = null;

  getSport() {
    return this.sport;
  }

  getOrganizationID(): string {
    if (this.getSport() === 'cbb') {
      return Organization.getCBBID();
    }

    if (this.getSport() === 'cfb') {
      return Organization.getCFBID();
    }

    // if there is no organization_id then go to 404 page
    return notFound();
  }

  getDivisionID(): string {
    if (this.getSport() === 'cbb') {
      return Division.getD1();
    }

    if (this.getSport() === 'cfb') {
      return Division.getFBS();
    }

    // if there is no division_id then go to 404 page
    return notFound();
  }

  getCurrentSeason(): number {
    if (this.getSport() === 'cbb') {
      return CBB.getCurrentSeason();
    }

    if (this.getSport() === 'cfb') {
      return CFB.getCurrentSeason();
    }

    // if there is no season then go to 404 page
    return notFound();
  }

  async getDecorate(args: unknown): Promise<null | React.JSX.Element | React.JSX.Element[]> {
    return null;
  }
}

export default Surface;
