import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { StatsDto } from "./dto/stats.dto";

const countries = [
  { name: "United States", flagUrl: "https://flagcdn.com/us.svg" },
  { name: "Canada", flagUrl: "https://flagcdn.com/ca.svg" },
  { name: "United Kingdom", flagUrl: "https://flagcdn.com/gb.svg" },
  { name: "Australia", flagUrl: "https://flagcdn.com/au.svg" },
  { name: "India", flagUrl: "https://flagcdn.com/in.svg" },
  { name: "Germany", flagUrl: "https://flagcdn.com/de.svg" },
  { name: "France", flagUrl: "https://flagcdn.com/fr.svg" },
  { name: "Japan", flagUrl: "https://flagcdn.com/jp.svg" },
  { name: "Brazil", flagUrl: "https://flagcdn.com/br.svg" },
  { name: "South Africa", flagUrl: "https://flagcdn.com/za.svg" },
];

function getRandomCountryWithFlag() {
  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
}

@Injectable()
export class StatsService {
  private statsData: StatsDto[] = [];

  constructor() {
    // generate random 50 stats data
    const numOfStats = 50;

    function getRandomGender() {
      const genders = ["men", "women"];
      const randomIndex = Math.floor(Math.random() * genders.length);
      return genders[randomIndex];
    }

    for (let index = 0; index < numOfStats; index++) {
      const gender = getRandomGender();
      const randomCountry = getRandomCountryWithFlag();
      const newStat: StatsDto = {
        id: faker.datatype.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        avatarUrl: `https://randomuser.me/api/portraits/${gender}/${index + 1}.jpg`,
        points: Math.floor(Math.random() * 1000),
        country: randomCountry.name,
        flagUrl: randomCountry.flagUrl,
        deltaSign: Math.sign(Math.random() - 0.5) as 1 | 0 | -1,
      };
      this.statsData.push(newStat);
    }
  }

  async findStats(limit: number) {
    // sort by points
    this.statsData = this.statsData.sort((prev, next) => next.points - prev.points);

    return this.statsData.slice(0, limit || 30);
  }

  async updateStat(statId: string, newPoints: number) {
    try {
      const targetStat = this.statsData.find((stat) => stat.id === statId);
      const delta = newPoints - targetStat.points;
      targetStat.deltaSign = delta > 0 ? 1 : delta < 0 ? -1 : 0;
      targetStat.points = newPoints;
    }
    catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }
}
