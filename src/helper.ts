// randomID generates a random string which can be used as
// an ID. There are risk of collision, this is NOT a UUID.
// However, to generate a few element in a page, it's a pragmatic
// choice to avoid a dependency toward a UUID lib.
export function randomID(): string {
  return Math.random().toString(36).substr(2, 12);
}
