"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMessage = void 0;
function errorMessage(error) {
    return error.code
        ? `Error code: ${error.code}. Please check prisma docs for referance: \n https://www.prisma.io/docs/reference/api-reference/error-reference`
        : error.message;
}
exports.errorMessage = errorMessage;
//# sourceMappingURL=prismaerror.utils.js.map