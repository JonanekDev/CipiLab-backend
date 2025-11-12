import { Injectable } from '@nestjs/common';
import { SettingKey } from 'generated/prisma/wasm';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SettingsService {
    private cache = new Map<SettingKey, string>();

    constructor(private readonly prisma: PrismaService) {}

    async onModuleInit() {
        const all = await this.prisma.setting.findMany();
        for (const s of all) this.cache.set(s.key, s.value);
    }

    get(key: SettingKey): string | undefined {
        return this.cache.get(key) || undefined;
    }

    async set(key: SettingKey, value: string): Promise<void> {
        this.cache.set(key, value);
        await this.prisma.setting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }

}
