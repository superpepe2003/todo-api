import { Controller, Get, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ok } from '../common/response.helper';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificaciones del usuario autenticado (no leídas primero)' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones' })
  async findAll(@CurrentUser() user: any) {
    const data = await this.notificationsService.findAllForUser(user.id);
    return ok(data);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  @ApiResponse({ status: 200, description: 'Todas las notificaciones marcadas como leídas' })
  async markAllRead(@CurrentUser() user: any) {
    await this.notificationsService.markAllRead(user.id);
    return ok(null, 'Todas las notificaciones marcadas como leídas');
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  async markRead(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    await this.notificationsService.markRead(id, user.id);
    return ok(null, 'Notificación marcada como leída');
  }
}
