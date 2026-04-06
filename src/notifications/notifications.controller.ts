import { Controller, Get, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ok } from '../common/response.helper';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    const data = await this.notificationsService.findAllForUser(user.id);
    return ok(data);
  }

  @Patch('read-all')
  async markAllRead(@CurrentUser() user: any) {
    await this.notificationsService.markAllRead(user.id);
    return ok(null, 'Todas las notificaciones marcadas como leídas');
  }

  @Patch(':id/read')
  async markRead(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    await this.notificationsService.markRead(id, user.id);
    return ok(null, 'Notificación marcada como leída');
  }
}
