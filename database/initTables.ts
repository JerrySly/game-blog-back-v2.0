import { DataTypes, Model, Sequelize } from "sequelize";

export class Post extends Model {
    declare uuid: string;
    tags?: Array<string>;
    title: string;
    hided: boolean;
    text: string;
    photo?: string;
    createdBy: string;
}

export class User extends Model {
    declare uuid: string;
    avatar: string;
    email: string;
    nickname: string;
    role: string;
    password: string;
}

export class Comment extends Model {
    declare uuid: string;
    text: string;
    createdBy: string;
    parrent: string;
}

export class Like extends Model {
    declare uuid: string;
    createdBy: string;
    linkedEntity: string;
    entityType: 'Comment' | 'Post'
}

export class Role extends Model {
    declare uuid: string;
    name: string;
    value: number;
}


export const initTables = async (sequelize: Sequelize) => {
    User.init({
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4, 
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.UUID,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'User'
    });
    Role.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        value: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Role'
    });
    Post.init({
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        title: {
            type:DataTypes.STRING,
            allowNull: false,
        },
        tags: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        hided: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Post'
    });
    Comment.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false, 
        },
        parrent: {
            type: DataTypes.UUID,
            allowNull: true,
        }
    }, {
        sequelize,
        modelName: 'Comment'
    });
    Like.init({
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        linkedEntity: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        entityType: {
            // 0: Comment, 1: Post
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Like'
    });
}