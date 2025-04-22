package repository

import (
	`context`
	`errors`

	`github.com/spf13/viper`
	`gorm.io/gorm`
)

type repository struct {
	db *gorm.DB
}

type transactionKey string

const PostgresTransaction transactionKey = "POSTGRES_TRANSACTION"

func (repo *repository) GetDbInstance(ctx context.Context) *gorm.DB {
	db, ok := ctx.Value(PostgresTransaction).(*gorm.DB)
	if !ok {
		db = repo.db.WithContext(ctx)
	}

	isDebugMode := viper.GetBool("debug")
	if isDebugMode {
		db = db.Debug()
	}

	return db
}

func (repo *repository) Begin(ctx context.Context) context.Context {
	tx := repo.db.WithContext(ctx).Begin() // make sure any timeout/cancellation already present in ctx will propagate
	return context.WithValue(ctx, PostgresTransaction, tx)
}

func (repo *repository) Commit(ctx context.Context) error {
	tx, ok := ctx.Value(PostgresTransaction).(*gorm.DB)
	if !ok {
		return errors.New("no transaction found in context")
	}

	tx.Commit()
	return tx.Error
}

func (repo *repository) Rollback(ctx context.Context) error {
	tx, ok := ctx.Value(PostgresTransaction).(*gorm.DB)
	if !ok {
		return errors.New("no transaction found in context")
	}

	tx.Rollback()
	return tx.Error
}