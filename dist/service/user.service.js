"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.validatePassword = exports.deleteUser = exports.updateUser = exports.findUser = exports.searchUsers = exports.getUsers = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const lodash_1 = require("lodash");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = __importDefault(require("../utils/logger"));
const client_2 = __importDefault(require("../utils/client"));
const calculateTimeOffDays_1 = require("../utils/calculateTimeOffDays");
client_2.default.$use(async (params, next) => {
    if ((params.action === 'create' || params.action === 'update') &&
        params.model === 'User' &&
        params.args.data.password) {
        const saltRounds = Number(process.env.SALT_ROUNDS);
        const salt = await bcrypt_1.default.genSalt(saltRounds);
        const password = bcrypt_1.default.hashSync(params.args.data.password, salt);
        params.args.data.password = password;
    }
    // * If we create new time off, we calculate how many days we should subtract from user's remaining time off days
    if (params.action === 'create' && params.model === 'TimeOff') {
        const startDate = params.args.data.startDate;
        const endDate = params.args.data.endDate;
        const timeOffDays = await (0, calculateTimeOffDays_1.calculateTimeOffDays)(startDate, endDate);
        const userId = params.args.data.user.connect.id;
        const user = await client_2.default.user.findFirst({ where: { id: userId } });
        if (user) {
            if (user.timeOffRemainingDays - timeOffDays <= 0) {
                throw new Error('Remaining time off days are not enough!');
            }
            const updatedUser = await client_2.default.user.update({
                where: { id: userId },
                data: { timeOffRemainingDays: user.timeOffRemainingDays - timeOffDays },
            });
            logger_1.default.info(`${updatedUser.name} day off remaining days are now ${updatedUser.timeOffRemainingDays}`);
        }
    }
    return next(params);
});
async function createUser(input, leadId) {
    // * leadId is primary key from User model
    try {
        let query = { data: input };
        if (leadId) {
            query = {
                data: {
                    ...input,
                    lead: {
                        connectOrCreate: {
                            where: {
                                id: leadId,
                            },
                            create: {
                                leadInfo: {
                                    connect: {
                                        id: leadId,
                                    },
                                },
                            },
                        },
                    },
                },
            };
        }
        const user = await client_2.default.user.create(query);
        return user;
    }
    catch (e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                logger_1.default.error('There is a unique constraint violation, a new user cannot be created with this email');
            }
        }
        throw e;
    }
}
exports.createUser = createUser;
async function getUsers(query) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const resultsCount = await client_2.default.user.count();
    const users = await client_2.default.user.findMany({
        skip: startIndex,
        take: limit,
        select: {
            id: true,
            email: true,
            name: true,
            enabled: true,
            authority: true,
            phone: true,
            discord: true,
            birthday: true,
            startingDate: true,
            alcohol: true,
            tshirtSize: true,
            createdAt: true,
            updatedAt: true,
            leadId: true,
            lead: {
                select: {
                    leadInfo: {
                        select: {
                            name: true,
                            email: true,
                            discord: true,
                        },
                    },
                },
            },
            celebration: { select: { id: true, occasion: true, startDate: true, enabled: true } },
            timeOffRemainingDays: true,
        },
    });
    return { data: users, resultsCount };
}
exports.getUsers = getUsers;
async function searchUsers(query) {
    const { emailOrName, leadId, birthday, startingDate } = query;
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const startIndex = (page - 1) * limit;
    const resultsCount = await client_2.default.user.count({
        where: {
            OR: [
                {
                    email: {
                        contains: emailOrName?.trim(),
                        mode: 'insensitive',
                    },
                },
                {
                    name: {
                        contains: emailOrName?.trim(),
                        mode: 'insensitive',
                    },
                    lead: {
                        id: leadId,
                    },
                    birthday: {
                        contains: birthday?.trim(),
                    },
                    startingDate: {
                        contains: startingDate?.trim(),
                    },
                },
            ],
        },
    });
    const searchedUsers = await client_2.default.user.findMany({
        take: limit,
        skip: startIndex,
        where: {
            OR: [
                {
                    email: {
                        contains: emailOrName?.trim(),
                        mode: 'insensitive',
                    },
                },
                {
                    name: {
                        contains: emailOrName?.trim(),
                        mode: 'insensitive',
                    },
                    lead: {
                        id: leadId,
                    },
                    birthday: {
                        contains: birthday?.trim(),
                    },
                    startingDate: {
                        contains: startingDate?.trim(),
                    },
                },
            ],
        },
        select: {
            id: true,
            email: true,
            name: true,
            enabled: true,
            authority: true,
            phone: true,
            discord: true,
            birthday: true,
            startingDate: true,
            alcohol: true,
            tshirtSize: true,
            createdAt: true,
            updatedAt: true,
            leadId: true,
            lead: {
                select: {
                    leadInfo: {
                        select: {
                            name: true,
                            email: true,
                            discord: true,
                        },
                    },
                },
            },
            celebration: { select: { occasion: true, startDate: true, enabled: true } },
            timeOffRemainingDays: true,
        },
    });
    return { data: searchedUsers, resultsCount };
}
exports.searchUsers = searchUsers;
async function findUser(query) {
    const user = client_2.default.user.findFirst({
        where: query,
        include: {
            lead: {
                select: {
                    leadInfo: {
                        select: {
                            name: true,
                            email: true,
                            discord: true,
                        },
                    },
                },
            },
            celebration: true,
        },
    });
    return (0, lodash_1.omit)(user, 'password');
}
exports.findUser = findUser;
async function updateUser(input, id, leadId) {
    try {
        let query = input;
        if (leadId) {
            query = {
                ...input,
                lead: {
                    connectOrCreate: {
                        where: {
                            id: leadId,
                        },
                        create: {
                            leadInfo: {
                                connect: {
                                    id: leadId,
                                },
                            },
                        },
                    },
                },
            };
        }
        const user = await client_2.default.user.update({ where: { id }, data: query });
        return user;
    }
    catch (e) {
        if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                logger_1.default.error('There is a unique constraint violation, a new user cannot be created with this email');
            }
        }
        throw e;
    }
}
exports.updateUser = updateUser;
async function deleteUser(id) {
    const deletedUser = await client_2.default.user.delete({ where: { id } });
    return deletedUser;
}
exports.deleteUser = deleteUser;
async function validatePassword({ email, password }) {
    const user = await client_2.default.user.findUnique({ where: { email } });
    if (!user)
        return false;
    const isValid = await comparePassword(password, user.password);
    if (!isValid)
        return false;
    return (0, lodash_1.omit)(user, 'password');
}
exports.validatePassword = validatePassword;
async function comparePassword(candidatePassword, userPassword) {
    return bcrypt_1.default.compare(candidatePassword, userPassword).catch(() => false);
}
exports.comparePassword = comparePassword;
//# sourceMappingURL=user.service.js.map