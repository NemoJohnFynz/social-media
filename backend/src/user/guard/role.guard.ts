import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { error } from 'console'; // Import error function from console module
import { Observable } from 'rxjs'; // Import Observable class from rxjs module

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private requiredRole: boolean) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.currentUser;
    
    console.log(currentUser);

    if (!currentUser) {
      console.log('RolesGuard: No currentUser found');
      throw new ForbiddenException('User not authenticated');
    }

    if (currentUser.role !== this.requiredRole) {
      console.log(`RolesGuard: Required role: ${this.requiredRole}, User role: ${currentUser.role}`);
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    return true;
  }
}
