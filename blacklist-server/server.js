#!/usr/bin/env node

const {
  TextDocuments,
  createConnection,
  DiagnosticSeverity,
} = require("vscode-languageserver");
const { TextDocument } = require("vscode-languageserver-textdocument");

const { getBlacklisted } = require("./getBlackListed.js");

console.info("Starting LSP");

const connection = createConnection();
const documents = new TextDocuments(TextDocument);

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: documents.syncKind,
  },
}));

documents.onDidChangeContent((change) => {
  connection.sendDiagnostics({
    uri: change.document.uri,
    diagnostics: getDiagnostics(change.document),
  });
});

const getDiagnostics = (textDocument) =>
  getBlacklisted(textDocument.getText()).map(
    blacklistToDiagnostic(textDocument)
  );

const blacklistToDiagnostic =
  (textDocument) =>
  ({ index, value }) => ({
    severity: DiagnosticSeverity.Warning,
    range: {
      start: textDocument.positionAt(index),
      end: textDocument.positionAt(index + value.length),
    },
    message: `${value} is blacklisted.`,
    source: "Blacklister",
  });

documents.listen(connection);
connection.listen();
